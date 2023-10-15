// app.component.ts

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface Product {
  name: string;
  id: string;
}

interface Module {
  id: string;
  name: string;
}

interface Profile {
  name: string;
  id: string;
}

interface MyObject {
  name: string;
  id: string;
  module: Module;
  products: Product[];
  profiles: Profile[];
  selected?: boolean;
}

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss'],
})
export class DataFormComponent implements OnInit {
  
  data: MyObject[] = [
    {
      name: 'Trilha 1',
      id: '1',
      module: { id: '102', name: 'Module2' },
      products: [
        { name: 'Product3', id: '201' },
        { name: 'Product4', id: '401' },
      ],
      profiles: [
        { name: 'Master', id: '303' },
        { name: 'Operador', id: '306' },
      ],
    },
    {
      name: 'Trilha 2',
      id: '2',
      module: { id: '102', name: 'Module2' },
      products: [{ name: 'Product1', id: '202' }],
      profiles: [
        { name: 'Master', id: '303' },
        { name: 'outroProfile', id: '304' },
      ],
    },
    {
      name: 'Trilha 3',
      id: '3',
      module: { id: '103', name: 'Module3' },
      products: [
        { name: 'Product2', id: '204'  },
        { name: 'Product4', id: '401' },
      ],
      profiles: [
        { name: 'Master', id: '303' },
        { name: 'Operador', id: '306' },
      ],
    },
    {
      name: 'Trilha 4',
      id: '4',
      module: { id: '104', name: 'Module4' },
      products: [
        { name: 'Product2', id: '204' },
        { name: 'Product1', id: '202' },
      ],
      profiles: [
        { name: 'outroProfile', id: '304' },
        { name: 'Profile4b', id: '308' },
        { name: 'Master', id: '303' },
      ],
    },
    {
      name: 'Trilha 5',
      id: '5',
      module: { id: '103', name: 'Module3' },
      products: [{ name: 'Product1', id: '202' }],
      profiles: [
        { name: 'outroProfile', id: '304' },
        { name: 'caixa', id: '310' },
      ],
    },
  ];

  checkboxModule = [
    { id: '101', name: 'Module1' },
    { id: '102', name: 'Module2' },
    { id: '103', name: 'Module3' },
    { id: '104', name: 'Module4' },
    { id: '105', name: 'Module5' },
  ];

  checkboxProducts = [
    { name: 'Product1', id: '202' },
    { name: 'Product2', id: '204' },
    { name: 'Product3', id: '201' },
    { name: 'Product4', id: '401' },
  ];
  checkboxsProfile = [
    { name: 'caixa', id: '310' },
    { name: 'Profile4b', id: '308' },
    { name: 'Operador', id: '306' },
    { name: 'Master', id: '303' },
    { name: 'outroProfile', id: '304' },
  ];

  private checkboxStateModule$ = new BehaviorSubject<string[]>([]);
  private checkboxStateProducts$ = new BehaviorSubject<string[]>([]);
  private checkboxStateProfiles$ = new BehaviorSubject<string[]>([]);

  private combinedCheckboxState$ = combineLatest([
    this.checkboxStateModule$,
    this.checkboxStateProducts$,
    this.checkboxStateProfiles$,
  ]).pipe(map((states) => states.reduce((acc, curr) => [...acc, ...curr], [])));

  filteredData$: Observable<MyObject[]> = combineLatest([
    of(this.data),
    this.combinedCheckboxState$,
  ]).pipe(map(([data, checkboxState]) => this.filterData(data, checkboxState)));

  constructor() {}

  ngOnInit(): void {

  }

  onCheckboxChange(event: any, id: string, type: string) {
    const isChecked = event.target.checked;

    switch (type) {
      case 'module':
        this.updateCheckboxState(this.checkboxStateModule$, id, isChecked);
        break;
      case 'products':
        this.updateCheckboxState(this.checkboxStateProducts$, id, isChecked);
        break;
      case 'profiles':
        this.updateCheckboxState(this.checkboxStateProfiles$, id, isChecked);
        break;
      default:
        break;
    }
  }

  private updateCheckboxState(
    checkboxState$: BehaviorSubject<string[]>,
    id: string,
    isChecked: boolean
  ) {
    const currentState = checkboxState$.value;
    const index = currentState.indexOf(id);

    if (isChecked && index === -1) {
      checkboxState$.next([...currentState, id]);
    } else if (!isChecked && index !== -1) {
      currentState.splice(index, 1);
      checkboxState$.next([...currentState]);
    }
  }

  private filterData(data: MyObject[], checkboxState: string[]): MyObject[] {
    console.log('Filtering data...');
    console.log('Checkbox state:', checkboxState);
  
    const filteredData = checkboxState.length === 0
      ? data
      : data.filter((item) => {
          console.log('Checking item:', item);
  
          const hasSelectedModule = checkboxState.includes(item.module.id);
          const hasSelectedProducts = checkboxState.some((id) =>
            item.products.some((product) => product.id === id)
          );
          const hasSelectedProfiles = checkboxState.some((id) =>
            item.profiles.some((profile) => profile.id === id)
          );
  
          const hasSelectedProductInProducts = checkboxState.some((id) =>
            item.products.some((product) => product.id === id)
          );
  
          // Adiciona lógica adicional para filtrar por profiles se products estiver selecionado
          const hasSelectedProfileInProducts =
            hasSelectedProducts &&
            checkboxState.some((id) =>
              item.profiles.some((profile) => profile.id === id)
            );
  
          const result =
            hasSelectedModule ||
            hasSelectedProducts ||
            hasSelectedProfiles ||
            hasSelectedProductInProducts ||
            hasSelectedProfileInProducts;
  
          console.log('Result:', result);
  
          return result;
        });
  
    console.log('Filtered data:', filteredData);
  
    return filteredData;
  }
}