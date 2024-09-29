"use client";

import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { EyeOutlined, TranslationOutlined } from "@ant-design/icons";
import { Foundation, SearchResponse } from "@/types";

import { siteConfig } from "@/config/site";

export default function Home() {
  const [projectDescription, setProjectDescription] = useState("");
  const [foundationPurpose, setFoundationPurpose] = useState("");
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const [selectedFoundation, setSelectedFoundation] =
    useState<Foundation | null>(null);
  const {
    isOpen: modalIsOpen,
    onOpen: modalOnOpen,
    onOpenChange: modalOnOpenChange,
  } = useDisclosure();
  const [translatingPurpose, setTranslatingPurpose] = useState<string | null>(
    null
  );
  const [saveDescription, setSaveDescription] = useState(false);

  const handleTransformDescription = async () => {
    setTransforming(true);
    try {
      const response = await fetch("/api/transform-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectDescription, saveDescription }),
      });
      const data = await response.json();
      setFoundationPurpose(data.transformedPurpose);
    } catch (error) {
      console.error("Error transforming description:", error);
    }
    setTransforming(false);
  };

  const handleFindFoundations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/find-foundations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foundationPurpose }),
      });
      const data: SearchResponse = await response.json();
      setSearchResponse(data);
    } catch (error) {
      console.error("Error finding foundations:", error);
    }
    setLoading(false);
  };

  const handleTranslatePurpose = async (purpose: string) => {
    setTranslatingPurpose(purpose);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: purpose }),
      });
      const data = await response.json();

      // Update the foundation's purpose with the translated text
      setSearchResponse((prevResponse) => {
        if (!prevResponse) return null;
        return {
          ...prevResponse,
          foundations: prevResponse.foundations.map((foundation) =>
            foundation.purpose === purpose
              ? { ...foundation, purpose: data.translatedText }
              : foundation
          ),
        };
      });
    } catch (error) {
      console.error("Error translating purpose:", error);
    }
    setTranslatingPurpose(null);
  };

  const showFoundationDetails = (foundation: Foundation) => {
    setSelectedFoundation(foundation);
    modalOnOpen();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "URLs",
      dataIndex: "contact",
      key: "urls",
      render: (contact: Foundation["contact"]) => (
        <>
          {contact.urls.map((url, index) => (
            <Link href={url} isExternal key={index} className="text-md">
              {url}
            </Link>
          ))}
        </>
      ),
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Relevance",
      dataIndex: "score",
      key: "score",
      render: (score: number) => (score * 100).toFixed(2) + "%",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Foundation) => (
        <div className="flex space-x-2">
          <Tooltip content="View details">
            <Button
              isIconOnly
              onClick={() => showFoundationDetails(record)}
              size="sm"
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
          <Tooltip content="Translate purpose">
            <Button
              isIconOnly
              onClick={() => handleTranslatePurpose(record.purpose || "")}
              isLoading={translatingPurpose === record.purpose}
              size="sm"
            >
              <TranslationOutlined />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const renderFoundationDetails = (foundation: Foundation) => (
    <div>
      <h3 className="text-2xl font-bold">Basic information</h3>
      <p>
        <strong>Internal ID:</strong> {foundation.internalId}
      </p>
      <p>
        <strong>Stiftungs ID:</strong> {foundation.stiftungsId}
      </p>
      <p>
        <strong>Name:</strong> {foundation.name}
      </p>
      <p>
        <strong>Purpose:</strong> {foundation.purpose}
      </p>
      <p>
        <strong>Score:</strong> {(foundation.score * 100).toFixed(2)}%
      </p>

      <h3 className="text-2xl font-bold mt-4">Contact information</h3>
      {foundation.contact.address.length > 0 && (
        <p>
          <strong>Address:</strong> {foundation.contact.address.join(", ")}
        </p>
      )}
      {foundation.contact.phone.length > 0 && (
        <p>
          <strong>Phone:</strong> {foundation.contact.phone.join(", ")}
        </p>
      )}
      {foundation.contact.fax.length > 0 && (
        <p>
          <strong>Fax:</strong> {foundation.contact.fax.join(", ")}
        </p>
      )}
      {foundation.contact.emails.length > 0 && (
        <p>
          <strong>Emails:</strong>{" "}
          {foundation.contact.emails.map((email, index) => (
            <React.Fragment key={index}>
              {index > 0 && ", "}
              <a href={`mailto:${email}`}>{email}</a>
            </React.Fragment>
          ))}
        </p>
      )}
      {foundation.contact.urls.length > 0 && (
        <p>
          <strong>URLs:</strong>{" "}
          {foundation.contact.urls.map((url, index) => (
            <React.Fragment key={index}>
              {index > 0 && ", "}
              <Link href={url} isExternal>
                {url}
              </Link>
            </React.Fragment>
          ))}
        </p>
      )}

      <h3 className="text-2xl font-bold mt-4">Additional content</h3>
      {foundation.content.map((item, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-xl font-bold">{item.title}</h4>
          <ul>
            {item.lines.map((line, lineIndex) => (
              <li key={lineIndex}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <h1>German Foundations</h1>
        <div className="flex flex-row space-x-2">
          <Link isExternal href={siteConfig.links.github}>
            <img
              src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"
              alt="GitHub"
            />
          </Link>
          <Link isExternal href={siteConfig.links.strategicProposal}>
            <img
              src="https://img.shields.io/badge/Strategic%20proposal-4285F4?style=flat&logo=google-slides&logoColor=white"
              alt="Strategic proposal"
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-col flex-grow sm:flex-row sm:space-x-4">
        <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <Textarea
            value={projectDescription}
            onValueChange={setProjectDescription}
            label="Project description"
            placeholder="Enter your project description in any language"
          />

          <div className="mt-4">
            <Checkbox
              isSelected={saveDescription}
              onValueChange={setSaveDescription}
            >
              <p className="text-xs">
                Check this box to allow us to save your input project
                description in our database, so that we can use it to improve
                this service. Please contact synergies@henophilia.org for
                co-creation and collaboration.
              </p>
            </Checkbox>
          </div>

          <Button
            color="primary"
            onClick={handleTransformDescription}
            isLoading={transforming}
            className="mt-4 w-full sm:w-auto"
          >
            Transform to foundation purpose
          </Button>
        </div>
        <div className="w-full sm:w-1/2">
          <Textarea
            value={foundationPurpose}
            onValueChange={setFoundationPurpose}
            label="Foundation purpose"
            placeholder="Foundation purpose in German will appear here"
          />
          <Button
            color="primary"
            onClick={handleFindFoundations}
            isLoading={loading}
            className="mt-4 w-full sm:w-auto"
            isDisabled={!foundationPurpose}
          >
            Find relevant foundations
          </Button>
        </div>
      </div>
      {searchResponse && (
        <>
          <div className="mt-8 mb-4">
            <span>
              Search execution time: {searchResponse.executionTime.toFixed(2)}{" "}
              seconds
            </span>
            <br />
            <span>
              Total foundations in database: {searchResponse.totalVectors}
            </span>
          </div>
          <Table aria-label="Foundations" removeWrapper>
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.title}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={searchResponse.foundations}>
              {(item) => (
                <TableRow key={item.internalId}>
                  {(columnKey) => {
                    const columnDef = columns.find((c) => c.key === columnKey);
                    let val = getKeyValue(
                      item,
                      columnDef?.dataIndex || columnKey
                    );
                    if (columnDef?.render) {
                      val = columnDef.render(val, item);
                    }
                    return <TableCell>{val}</TableCell>;
                  }}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}
      <Modal
        isOpen={modalIsOpen}
        onOpenChange={modalOnOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Foundation details
              </ModalHeader>
              <ModalBody>
                {selectedFoundation &&
                  renderFoundationDetails(selectedFoundation)}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
