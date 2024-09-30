import { MapLatLng } from "./MapLatLng";
import { UseMapReturnType } from "../hook/useMap";

export type MapProps = {
	children?: React.ReactNode;
	mapOptions?: google.maps.MapOptions;
	onLoad: (map: google.maps.Map) => void;
	onDblClick?: (event: google.maps.MapMouseEvent) => void;
	onClick?: (event: google.maps.MapMouseEvent) => void;
	isLoaded: boolean;
	defaultCenter?: MapLatLng;
	isUserLocation?: boolean;
};

export type MapAutocompleteProps = {
	locationData: UseMapReturnType["locationData"];
	setAutocomplete: UseMapReturnType["setAutocomplete"];
	handleMapInputChages: UseMapReturnType["handleMapInputChages"];
	handleAutocompleteSelect: UseMapReturnType["handleAutocompleteSelect"];
};
