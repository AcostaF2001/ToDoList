import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  imports: [RouterModule], // IMPORTAR RouterModule aquí
})
export class AppContentComponent {}
