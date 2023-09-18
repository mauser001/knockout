import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent {
  isOpen = true;
  constructor() {
    this.isOpen = localStorage?.getItem("hide-disclaimer") !== "true";
  }

  toggleIsOpen = () => {
    this.isOpen = !this.isOpen;
    localStorage?.setItem("hide-disclaimer", `${!this.isOpen}`)
  }

}
