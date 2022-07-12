import Alpine from 'alpinejs';
import './style.css'
import EQueue from './noQueue';
// import flatpickr from "flatpickr";

window.Alpine = Alpine

Alpine.data('isOpen', EQueue);

Alpine.start()

