import Alpine from 'alpinejs';
import './style.css'
import EQueue from './noQueue';



window.Alpine = Alpine

Alpine.data('isOpen', EQueue);


Alpine.start()



