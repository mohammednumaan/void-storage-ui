import { useEffect, useState } from "react";
import PublicView from "../PublicView/PublicView";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavigationBar from "../../Navigation/NavigationBar";
import folderViewStyles from "../../FolderView/FolderView.module.css";
import styles from "./PublicViewHome.module.css";
import { format } from "date-fns";

const getFileSize = (bytes) => {
  let sizes = ["B", " KB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB"];

  for (let i = 1; i < sizes.length; i++) {
    if (bytes < Math.pow(1024, i)) {
      return (
        Math.round((bytes / Math.pow(1024, i - 1)) * 100) / 100 + sizes[i - 1]
      );
    }
  }
  return bytes;
};

export default function PublicViewHome() {
  const navigate = useNavigate();
  const { linkId, folderId, type } = useParams();

  const [resource, setResource] = useState({
    type: null,
    id: null,
    name: null,
    fileInfo: null,
  });
  const [isOpenDetails, setIsOpenDetails] = useState({ fileId: null });

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    async function getSharedResource() {
      const res = await fetch(
        `${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/${type}s/view/public/${linkId}/`,
        {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            linkId,
            type: type === "folder" ? "folder" : "file",
          }),
        },
      );

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setResource({
          type: data.type,
          id: data.id,
          fileInfo: data.fileInfo,
          name: data.name,
        });
      } else {
        navigate("/view/public/error", { state: { error: data.message } });
      }
    }

    getSharedResource();
  }, [isOpenDetails, breadcrumbs]);

  useEffect(() => {
    console.log("Folder");
    async function getFolderPathSegements() {
      const response = await fetch(
        `${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/folders/segments/${resource.id}/${folderId}`,
        {
          mode: "cors",
        },
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        const segments = data.folderSegments;
        setBreadcrumbs([...segments]);
      } else {
        console.error(data.message);
      }
    }

    if (folderId && resource.id && resource.type === "Folder")
      getFolderPathSegements();
  }, [folderId, resource.id]);

  const handleDownload = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_DEVELOPMENT_SERVER}/file-system/files/asset/download/${resource.id}`,
      {
        method: "GET",
        mode: "cors",
      },
    );

    const data = await response.blob();
    const url = URL.createObjectURL(data);

    const temporaryLinkEl = document.createElement("a");
    temporaryLinkEl.href = url;
    temporaryLinkEl.download = resource.fileInfo?.fileName || "image";
    document.body.appendChild(temporaryLinkEl);
    temporaryLinkEl.click();
    document.body.removeChild(temporaryLinkEl);
    URL.revokeObjectURL(url);
  };
  console.log(breadcrumbs.length, resource);
  return (
    <div className={styles["public-folder-view"]}>
      {type === "folder" && (
        <>
          <NavigationBar />
          <nav className={styles["breadcrumbs"]}>
            <small key={resource.id} className={styles["breadcrumb-segment"]}>
              <Link
                to={`/view/public/folder/${linkId}`}
                onClick={() => setBreadcrumbs([])}
              >
                {resource.name}
              </Link>
              <img
                alt="chevron right icon"
                src="/public/chevron_right_icon.svg"
              />
            </small>
            {breadcrumbs.length !== 0 &&
              breadcrumbs.map((breadcrumb) => (
                <>
                  <small
                    key={breadcrumb.id}
                    className={styles["breadcrumb-segment"]}
                  >
                    <Link
                      to={`/view/public/folder/${linkId}/${folderId}/${breadcrumb.id}`}
                    >
                      {breadcrumb.name}
                    </Link>
                    <img
                      alt="chevron right icon"
                      src="/public/chevron_right_icon.svg"
                    />
                  </small>
                </>
              ))}
          </nav>

          <PublicView
            resource={resource}
            linkId={linkId}
            isOpenDetails={isOpenDetails}
            setIsOpenDetails={setIsOpenDetails}
            getFileSize={getFileSize}
          />
        </>
      )}

      {type === "file" && resource.id && (
        <>
          <div className={styles["shared-file-background"]}>
            <div className={styles["orange-dot"]} />
          </div>
          <div className={styles["shared-file"]}>
            <h2>{resource.fileInfo?.fileName}</h2>

            <div className={styles["file-preview"]}>
              {resource.fileInfo?.fileName.includes("pdf") ? (
                <embed
                  style={{ borderRadius: "10px" }}
                  src={resource.fileInfo?.fileUrl}
                  height={"100%"}
                  width={"100%"}
                />
              ) : resource.fileInfo?.fileName.includes("text") ||
                resource.fileInfo?.fileName.includes("doc") ? (
                <p>Text/Document File, Download This File To View</p>
              ) : (
                <img
                  style={{ borderRadius: "10px" }}
                  src={resource.fileInfo?.fileUrl}
                  alt={`${resource.fileInfo?.fileName?.fileName} image`}
                />
              )}
            </div>

            <div className={styles["file-info"]}>
              <div className={styles["shared-file-info-top"]}>
                <p>
                  <mark className={styles["marked-text"]}>File name:</mark>{" "}
                  {resource.fileInfo?.fileName}
                </p>
                <p>
                  <mark className={styles["marked-text"]}>File Type:</mark>{" "}
                  {resource.fileInfo?.fileType}
                </p>
              </div>
              <div className={styles["shared-file-info-bottom"]}>
                <p>
                  <mark className={styles["marked-text"]}>File Size:</mark>{" "}
                  {getFileSize(resource.fileInfo?.fileSize)}
                </p>
                <p>
                  <mark className={styles["marked-text"]}>Created At:</mark>{" "}
                  {format(resource.fileInfo.createdAt, "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              style={{ width: "210px", color: "#ff5a30" }}
            >
              Download
            </button>
          </div>
        </>
      )}
    </div>
  );
}
