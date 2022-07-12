import Alpine from 'alpinejs';
import './style.css'
import EQueue from './noQueue';
// import flatpickr from "flatpickr";

window.Alpine = Alpine

console.log(EQueue);

Alpine.data('isOpen', EQueue);

Alpine.start()

