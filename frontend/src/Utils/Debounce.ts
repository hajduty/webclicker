export const debounceConstructor = function ( delay: number ) {
	let timer: number;
	const debounce = function ( callback: () => void ) {
		clearTimeout( timer );
		timer = setTimeout(function () {
			callback();
		}, delay);
		return timer;
	};
	return debounce;
};
