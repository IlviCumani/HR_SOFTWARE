import { useState } from "react";
import { SelectedLocationData, MapLatLng } from "../types/MapLatLng";

export type UseMapReturnType = {
	locationData: SelectedLocationData;
	setMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>;
	setAutocomplete: React.Dispatch<React.SetStateAction<google.maps.places.Autocomplete | null>>;
	handleAutocompleteSelect: () => void;
	handleDargAndDblClickEvents: (e: google.maps.MapMouseEvent) => void;
	handleIconClick: (e: google.maps.MapMouseEvent) => void;
	handleMapInputChages: (newNameText: string) => void;
	mapRef: google.maps.Map | null;
};

export default function useMap(): UseMapReturnType {
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

	const [locationData, setLocationData] = useState<SelectedLocationData>({
		position: null,
		address: "",
		name: "",
	});

	function handleTextValuesUpdate(name: string | undefined, address: string) {
		setLocationData((prev) => {
			return {
				...prev,
				name,
				address,
			};
		});
	}

	function handleMapLocationChange(newLocation: MapLatLng) {
		setLocationData((prev) => {
			return {
				...prev,
				position: newLocation,
			};
		});
	}

	function handleLocationDataUpdate(newLocationData: SelectedLocationData) {
		setLocationData(newLocationData);
	}

	function handleMapInputChages(newNameText: string) {
		setLocationData((prev) => {
			return {
				...prev,
				name: newNameText,
				address: "",
			};
		});
	}

	function handleAutocompleteSelect() {
		const place = autocomplete!.getPlace();

		if (place.geometry) {
			const lat = place.geometry.location!.lat();
			const lng = place.geometry.location!.lng();

			map?.setCenter(new google.maps.LatLng({ lat, lng }));
			handleMapLocationChange({ lat, lng });
			handleTextValuesUpdate(place.name!, place.formatted_address!);
			console.log(place.name);
		}
	}

	function handleDargAndDblClickEvents(e: google.maps.MapMouseEvent) {
		const lat = e.latLng!.lat();
		const lng = e.latLng!.lng();

		new google.maps.Geocoder().geocode(
			{
				location: { lat, lng },
			},
			(results, status) => {
				if (status === google.maps.GeocoderStatus.OK) {
					if (results) {
						const place = results[0].formatted_address;
						handleTextValuesUpdate(undefined, place!);
					}
				}
			},
		);
		//close any open info windows
		handleMapLocationChange({ lat, lng });
	}

	function handleIconClick(e: google.maps.MapMouseEvent) {
		const IconMouseEvent = e as google.maps.IconMouseEvent;

		const placeId = IconMouseEvent.placeId;

		if (placeId) {
			const service = new google.maps.places.PlacesService(map!);

			service.getDetails(
				{
					placeId: placeId,
					fields: ["name", "formatted_address", "place_id", "geometry"],
				},
				(place, status) => {
					if (status === google.maps.places.PlacesServiceStatus.OK) {
						if (place) {
							const newLocationData: SelectedLocationData = {
								position: {
									lat: place.geometry!.location!.lat(),
									lng: place.geometry!.location!.lng(),
								},
								address: place.formatted_address!,
								name: place.name!,
							};
							handleLocationDataUpdate(newLocationData);
						}
					} else {
						console.error("Error retrieving place details:", status);
					}
				},
			);
		}
	}

	return {
		locationData,
		setMap,
		setAutocomplete,
		handleAutocompleteSelect,
		handleDargAndDblClickEvents,
		handleIconClick,
		handleMapInputChages,
		mapRef: map,
	};
}
