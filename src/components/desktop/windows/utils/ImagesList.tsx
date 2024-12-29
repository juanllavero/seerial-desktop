import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageCard from "./ImageCard";
import { useWebSocketsContext } from "context/ws.context";
import { useDataContext } from "context/data.context";

function ImagesList({
	images,
	imageWidth,
	imagesUrls,
	setImagesUrls,
	downloadPath,
	selectedImage,
	selectImage,
	setImageDownloaded,
}: {
	images: string[];
	imageWidth: number;
	imagesUrls: string[];
	setImagesUrls: (imagesUrls: string[]) => void;
	downloadPath: string;
	selectedImage: string | undefined;
	selectImage: (image: string | undefined) => void;
	setImageDownloaded: (imageDownloaded: boolean) => void;
}) {
	const { t } = useTranslation();
	const { serverIP } = useDataContext();
	const { setDownloading } = useWebSocketsContext();

	const [pasteUrl, setPasteUrl] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string>("");

	const handleDownload = () => {
		setPasteUrl(false);
		setDownloading(true);

		fetch(`https://${serverIP}/downloadImage`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				url: imageUrl,
				downloadFolder: downloadPath,
				fileName: imageUrl.split("/").pop(),
			}),
		})
			.then((response) => response.json())
			.finally(() => {
				setImageDownloaded(true);
				setDownloading(false);
			});

		setImagesUrls(imagesUrls.filter((url) => url !== imageUrl));
	};

	// Preprocess the names of the images in `images` and store them in a Set
	const imageNamesSet = new Set(
		images.map((image) => image.split("\\").pop()?.toLowerCase())
	);

	// Filter the URLs whose name is not in the Set
	const filteredImagesUrls =
		imagesUrls &&
		imagesUrls.filter((imageUrl) => {
			const imageNameFromUrl = imageUrl.split("/").pop()?.toLowerCase();
			return imageNameFromUrl && !imageNamesSet.has(imageNameFromUrl);
		});

	const handleImageLoad = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = () => {
			const file = input.files?.[0];
			if (file) {
				const formData = new FormData();
				formData.append("image", file);
				formData.append("destPath", downloadPath);

				console.log(downloadPath);
		
				// Muestra un estado de descarga mientras se procesa
				setDownloading(true);
		
				// Envía la imagen al servidor
				fetch(`https://${serverIP}/uploadImage`, {
				  method: "POST",
				  body: formData,
				})
				  .then((response) => {
					 if (response.ok) {
						setImageDownloaded(true);
					 } else {
						console.error("Error uploading image to server:", response.statusText);
					 }
				  })
				  .catch((error) => {
					 console.error("Error in fetch request:", error);
				  })
				  .finally(() => {
					 setDownloading(false);
				  });
			 }
		};
		input.click();
	};

	return (
		<>
			{pasteUrl ? (
				<div className="horizontal-center-align">
					<div className="dialog-input-box">
						<input
							type="text"
							placeholder={t("urlText")}
							onChange={(e) => {
								setImageUrl(e.target.value);
							}}
						/>
					</div>
					<button
						className="desktop-dialog-btn"
						onClick={() => setPasteUrl(false)}
					>
						{t("cancelButton")}
					</button>
					<button
						className="desktop-dialog-btn"
						onClick={() => handleDownload()}
					>
						{t("loadButton")}
					</button>
				</div>
			) : (
				<div className="horizontal-center-align">
					<button
						className="desktop-dialog-btn"
						onClick={() => handleImageLoad()}
					>
						{t("selectImage")}
					</button>
					<button
						className="desktop-dialog-btn"
						onClick={() => setPasteUrl(true)}
					>
						{t("fromURLButton")}
					</button>
				</div>
			)}
			<div className="dialog-images-scroll">
				{images &&
					images.map((image: string, index: number) => (
						<ImageCard
							key={image}
							image={image}
							index={index}
							selectImage={selectImage}
							selectedImage={selectedImage}
							imagePath={`file://${image}`}
							isUrl={false}
						/>
					))}
				{filteredImagesUrls &&
					filteredImagesUrls.map((image: string, index: number) => (
						<ImageCard
							key={image}
							image={image}
							index={index}
							selectImage={selectImage}
							selectedImage={selectedImage}
							imagePath={image}
							isUrl={true}
						/>
					))}
			</div>
		</>
	);
}

export default React.memo(ImagesList);
