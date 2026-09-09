import type { Dependant } from '../../types';
import { DependantItem } from '../dependant-item';
import styles from './DependantList.module.css';

const mock: Dependant[] = [
  { id: 1, nimi: 'Testi 1' },
  { id: 2, nimi: 'Testi 2' },
  { id: 3, nimi: 'Testi 3' },
];

export const DependantList = ({ items = mock }) => {
  return (
    <div className={styles.items}>
      {items.map((item, index) => (
        <DependantItem key={index} item={item} />
      ))}
    </div>
  );
};
