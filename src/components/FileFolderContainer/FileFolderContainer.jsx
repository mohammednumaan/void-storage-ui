//  imports
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

import styles from "./FileFolder.module.css";
import FileDetailsSidebar from "../Sidebars/FileDetailsSidebar/FileDetailsSidebar";
import DropdownMenu from "../Menus/DropdownMenu/DropdownMenu";

// a simple function to convert the file size
// to a human readable format for display purposes
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
// a dynamic component that renders both files and folders
export default function FileFolderContainer({
  rootFolderId,
  fileFolderData,
  setRenameForm,
  setDeleteForm,
  setMoveFolderData,
  setShareForm,
}) {
  // navigate hook to navigate between components
  const navigate = useNavigate();

  // extract folder and file id from the url
  const { folderId } = useParams();
  const [height, setHeight] = useState(null);

  const menuRef = useRef([]);
  const [menuId, setMenuId] = useState("");

  const [isOpenDetails, setIsOpenDetails] = useState({ fileId: null });

  const handleMenuClick = (event, id) => {
    // retrieve the current folder container
    // and its dimensional properties
    const container = event.currentTarget;
    const { top, height } = container.getBoundingClientRect();

    // check if the click is on the same folder
    // if true, we close the menu else, we close
    // the old menu and open the menu for the new folder
    if (id !== menuId) {
      setMenuId(id);
      setHeight(`${top + height - 16}px`);
    } else {
      setMenuId(null);
    }
  };

  // a simple useEffect to close the menu if a
  // click anywhere outside the menu is detected when the menu is open
  useEffect(() => {
    const handleClick = (e) => {
      const clickedOutsideMenu = menuRef.current.every((menu) => {
        if (menu == null) return true;
        return menu && !menu.contains(e.target);
      });
      if (clickedOutsideMenu) setMenuId(null);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menuRef]);

  // a simple function to handle double clicks for the file/folder container
  // to redirect the user to the correct file/folder route to view details
  const handleDoubleClick = () => {
    if (fileFolderData.dataType === "Folder") {
      navigate(`/tree/${folderId || rootFolderId}/${fileFolderData.data.id}`);
    }
  };

  const handleGotoFolder = () => {
    navigate(`/tree/`);
  };

  return (
    <>
      <Link
        className={styles["file-folder-container"]}
        onDoubleClick={handleDoubleClick}
      >
        <div className={styles["file-folder"]}>
          <div className={styles["file-folder-left"]}>
            {fileFolderData.dataType === "Folder" ? (
              <img
                className={styles["folder-icon"]}
                src="/folder_open_icon.svg"
                alt="folder icon"
              />
            ) : (
              <img
                src="/file_icon.svg"
                className={styles["file-icon"]}
                alt="file icon"
              />
            )}

            <small className={styles["file-folder-name"]}>
              {fileFolderData.dataType === "File" && (
                <span className={styles["file-extension"]}>
                  {`[${fileFolderData.data.fileName.split(".")[fileFolderData.data.fileName.split(".").length - 1]}]`}
                </span>
              )}
              <span>
                {fileFolderData.dataType === "Folder"
                  ? fileFolderData.data.folderName
                  : fileFolderData.data.fileName}
              </span>
            </small>
          </div>
          <div className={styles["file-folder-right"]}>
            <small className={styles["file-folder-size"]}>
              {fileFolderData.dataType === "Folder"
                ? "-"
                : getFileSize(fileFolderData.data.fileSize)}
            </small>
            <small className={styles["file-folder-created"]}>
              {format(fileFolderData.data.createdAt, "MMM d, yyyy")}
            </small>
            <img
              className={styles["file-folder-options"]}
              ref={(el) => menuRef.current.push(el)}
              onClick={(e) => handleMenuClick(e, fileFolderData.data.id)}
              title="More Options"
              src="/more_options_icon.svg"
              alt="more options icon"
            />
            <DropdownMenu
              menuId={menuId}
              height={height}
              fileFolderData={fileFolderData}
              setDeleteForm={setDeleteForm}
              setRenameForm={setRenameForm}
              setMoveFolderData={setMoveFolderData}
              rootFolderId={rootFolderId}
              setIsOpenDetails={setIsOpenDetails}
              setShareForm={setShareForm}
            />
          </div>
        </div>
      </Link>

      <FileDetailsSidebar
        selectedFile={isOpenDetails}
        setIsOpenDetails={setIsOpenDetails}
        getFileSize={getFileSize}
        gotoParentFolder={handleGotoFolder}
        setShareForm={setShareForm}
      />
    </>
  );
}
