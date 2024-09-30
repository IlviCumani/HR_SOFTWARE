import Map from "../Map/Map";
import { useJsApiLoader, Libraries } from "@react-google-maps/api";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa";
import { useState } from "react";
import Button from "../../../../components/Shared/Button";
import { Carousel } from "antd";
import { EvenType } from "../../types/EventTypes";

import "../../styles/FlipableCard.css";

const libraries: Libraries = ["places", "geocoding"];
const API = import.meta.env.REACT_APP_GOOGLE_MAPS_API;

const mapOptions: google.maps.MapOptions = {
	zoomControl: false,
	streetViewControl: false,
	fullscreenControl: false,
	mapTypeControl: false,
	clickableIcons: false,
};

export function PhotosAndMapCard({ selectedEvent }: { selectedEvent: EvenType }) {
	const [showMap, setShowMap] = useState(false);

	function handleShowImage() {
		setShowMap((prev) => !prev);
	}

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: API,
		libraries: libraries,
	});

	return (
		<div className="carousel-map-container">
			<Button
				onClick={handleShowImage}
				type="default"
				icon={
					!showMap ? (
						<FaMapMarkedAlt className="map-carousel-container-icon" />
					) : (
						<FaRegImage className="map-carousel-container-icon" />
					)
				}
				className="map-carousel-btn"
				size="large"
				shape="circle"
			/>

			<div className={`flip-card-inner ${showMap ? "rotate_card" : "rotate_card_back"}   `}>
				<div className="flip-card-front">
					<Carousel pauseOnHover adaptiveHeight draggable>
						{selectedEvent.images?.map((image: string, index: number) => (
							<div key={index} className="selected-event-image-container">
								<img src={image} alt={`Event ${index}`} className="selected-event-image" />
							</div>
						))}
					</Carousel>
				</div>
				<div className="flip-card-back">
					<Map
						onLoad={(map) => {
							new google.maps.Marker({
								position: {
									lat: selectedEvent.location.position!.lat,
									lng: selectedEvent.location.position!.lng,
								},
								map: map,
							});
						}}
						mapOptions={mapOptions}
						defaultCenter={{
							lat: selectedEvent.location.position!.lat,
							lng: selectedEvent.location.position!.lng,
						}}
						isLoaded={isLoaded}
					></Map>
				</div>
			</div>
		</div>
	);
}
