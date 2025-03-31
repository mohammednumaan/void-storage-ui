// imports
import { useParams } from "react-router-dom";
import styles from "./DropdownMenu.module.css";

// a custom dropdown meny that dynamically renders based on the dataType passed in
export default function DropdownMenu({
  menuId,
  height,
  fileFolderData,
  setDeleteForm,
  setRenameForm,
  setMoveFolderData,
  setIsOpenDetails,
  rootFolderId,
  setShareForm,
}) {
  const { folderId } = useParams();
  return (
    <div className={styles["dropdown-menu"]} style={{ top: "10em" }}>
      <ul
        className={`${styles.menu} ${menuId === fileFolderData.data.id ? styles.open : ""} 
                    `}
        style={{ top: height }}
      >
        <li>
          <button
            className={styles["menu-item-btn"]}
            onClick={() => {
              setDeleteForm({ isOpen: true, fileFolder: fileFolderData });
            }}
          >
            <img
              alt="delete icon"
              src="/folder_delete_icon.svg"
              title={`Delete ${fileFolderData.dataType}`}
            />
            Delete
          </button>
        </li>
        <hr
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "1px",
            opacity: 0.1,
            marginTop: "1px",
          }}
        />
        <li>
          <button
            className={styles["menu-item-btn"]}
            onClick={() =>
              setRenameForm({ isOpen: true, fileFolder: fileFolderData })
            }
          >
            <img
              alt="rename icon"
              src="/folder_edit_icon.svg"
              title={`Delete ${fileFolderData.dataType}`}
            />
            Edit
          </button>
        </li>
        <hr
          style={{
            backgroundColor: "white",
            width: "100%",
            height: "1px",
            opacity: 0.1,
            marginTop: "1px",
          }}
        />
        <li>
          <button
            className={styles["menu-item-btn"]}
            onClick={() =>
              setMoveFolderData({
                type: fileFolderData.dataType,
                id: fileFolderData.data.id,
                folder: folderId || rootFolderId,
              })
            }
          >
            <img
              alt="move icon"
              src="/move_icon.svg"
              title={`Move ${fileFolderData.dataType}`}
            />
            Move
          </button>
        </li>
        {fileFolderData.dataType === "Folder" && (
          <>
            <hr
              style={{
                backgroundColor: "white",
                width: "100%",
                height: "1px",
                opacity: 0.1,
                marginTop: "1px",
              }}
            />
            <li>
              <button
                className={styles["menu-item-btn"]}
                onClick={() =>
                  setShareForm({
                    isOpen: true,
                    fileFolder: {
                      id: fileFolderData.data.id || rootFolderId,
                      dataType: "Folder",
                    },
                  })
                }
              >
                <img
                  alt="share icon"
                  src="/share_icon.svg"
                  title={`Move ${fileFolderData.dataType}`}
                />
                Share
              </button>
            </li>
          </>
        )}

        {fileFolderData.dataType === "File" && (
          <>
            <hr
              style={{
                backgroundColor: "white",
                width: "100%",
                height: "1px",
                opacity: 0.1,
                marginTop: "1px",
              }}
            />
            <li>
              <button
                className={styles["menu-item-btn"]}
                onClick={() =>
                  setIsOpenDetails({ fileId: fileFolderData.data.id })
                }
              >
                <img
                  alt="info icon"
                  src="/info_icon.svg"
                  title={"View File Details"}
                />
                Details
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
