import { Component } from '@angular/core';
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import { MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    MatTab,
    MatIconModule,
    MatTabGroup,
    MatTabLabel
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {

}
