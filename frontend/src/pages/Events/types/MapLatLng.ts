export type MapLatLng = {
	lat: number;
	lng: number;
};

export type SelectedLocationData = {
	position: MapLatLng | null;
	address: string;
	name: string | undefined;
	// _id: string | undefined;
};

