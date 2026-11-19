import { STORE } from '../config';
import { WhatsAppIcon } from './Icons';

export default function WhatsAppButton() {
  const href = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hello ${STORE.name}, I need some help.`)}`;
  return (
    <a className="whatsapp" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
      <WhatsAppIcon size={28} />
    </a>
  );
}
