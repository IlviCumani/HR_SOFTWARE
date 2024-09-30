import { Marker, useJsApiLoader, Libraries } from "@react-google-maps/api";
import { Flex } from "antd";
import { UseMapReturnType } from "../../hook/useMap";
import Map from "./Map";
import MapAutocomplete from "./MapAutoComplete";

const libraries: Libraries = ["places", "geocoding"];
const API = import.meta.env.REACT_APP_GOOGLE_MAPS_API;

const mapOptions: google.maps.MapOptions = {
	zoomControl: false,
	streetViewControl: false,
	fullscreenControl: false,
	mapTypeControl: false,
	disableDoubleClickZoom: true,
};

export default function MapInput({ map }: { map: UseMapReturnType }) {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: API,
		libraries: libraries,
	});

	return (
		<Flex
			vertical
			style={{
				marginBottom: 20,
				width: "100%",
				height: 400,
			}}
		>
			{isLoaded && (
				<MapAutocomplete
					locationData={map.locationData}
					setAutocomplete={map.setAutocomplete}
					handleMapInputChages={map.handleMapInputChages}
					handleAutocompleteSelect={map.handleAutocompleteSelect}
				/>
			)}

			<Map
				onLoad={map.setMap}
				mapOptions={mapOptions}
				isLoaded={isLoaded}
				onDblClick={map.handleDargAndDblClickEvents}
				onClick={map.handleIconClick}
				isUserLocation
			>
				{map.locationData.position && (
					<Marker
						position={{
							lat: map.locationData.position.lat,
							lng: map.locationData.position.lng,
						}}
						onDragEnd={map.handleDargAndDblClickEvents}
						draggable
					/>
				)}
			</Map>
		</Flex>
	);
}
