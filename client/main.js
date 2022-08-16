import Alpine from 'alpinejs';
import './style.css'
import EQueue from './noQueue';

// import flatpickr from "flatpickr";
// export default flatpickr;

window.Alpine = Alpine

Alpine.data('isOpen', EQueue);
// Alpine.data('onTime', flatpickr)

Alpine.start()


// here 
// import './style.css'
// import Alpine from 'alpinejs';
// Alpine.data('data', () => ({
// 	init() {
		// alert('Ola')
	// }
// }))

// Alpine.start()
// 