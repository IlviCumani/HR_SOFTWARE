import { GoogleMap } from "@react-google-maps/api";
import { Flex, Skeleton } from "antd";
import { MapProps } from "../../types/MapComponents";
import "../../styles/Map.css";

export default function Map({
	children,
	mapOptions,
	onLoad,
	onDblClick,
	onClick,
	isLoaded,
	defaultCenter = { lat: 41.331672, lng: 19.8203257 },
	isUserLocation = false,
}: MapProps) {
	// function getUserCurrentLocation(map: google.maps.Map) {
	// 	navigator.geolocation.getCurrentPosition((position) => {
	// 		const currentLocation = {
	// 			lat: position.coords.latitude,
	// 			lng: position.coords.longitude,
	// 		};

	// 		map.setCenter(currentLocation);
	// 	});
	// }

	if (!isLoaded) {
		return (
			<Flex vertical className="map-skeleton-container">
				<Skeleton.Input className="map-skeleton" active />
			</Flex>
		);
	}

	return (
		<Flex
			style={{
				height: "100%",
				width: "100%",
				borderRadius: 10,
				overflow: "hidden",
				border: "1px solid #d9d9d9",
			}}
		>
			<GoogleMap
				zoom={15}
				mapContainerStyle={{ height: "100%", width: "100%" }}
				options={mapOptions}
				onLoad={(map) => {
					onLoad(map);
					
					map.setCenter(new google.maps.LatLng(defaultCenter.lat, defaultCenter.lng));
				}}
				onDblClick={onDblClick}
				onClick={(event) => {
					onClick && onClick(event);
				}}
			>
				{children}
			</GoogleMap>
		</Flex>
	);
}
