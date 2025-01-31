
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";

@Component({
    selector: 'app-root',
  standalone:true,
    imports: [RouterOutlet,],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hospital_app';
}
