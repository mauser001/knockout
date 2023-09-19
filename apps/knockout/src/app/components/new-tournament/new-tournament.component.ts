import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CreateTournamentService } from 'src/app/services/tournament/create-tournament.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { Web3ConnectService } from 'src/app/services/web3-connect.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-tournament',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [CreateTournamentService, MatDatepickerModule],
  templateUrl: './new-tournament.component.html',
  styleUrls: ['./new-tournament.component.scss']
})
export class NewTournamentComponent {
  isLoading$ = this.createTournamentService.isLoading$;
  hasError$ = this.createTournamentService.hasError$;
  tournamentForm: FormGroup;
  tomorrow: Date;
  nativeCurrency$ = this.web3ConnectService.nativeCurrency$;

  constructor(
    private createTournamentService: CreateTournamentService,
    private web3ConnectService: Web3ConnectService,
    private fb: FormBuilder,
    private routerService: Router
  ) {
    this.tomorrow = new Date()
    this.tomorrow.setDate(this.tomorrow.getDate() + 1)
    this.tournamentForm = fb.group({
      tournamentName: new FormControl("", {
        validators: [Validators.minLength(1), Validators.required]
      }),
      cost: new FormControl(0.00001, { validators: [Validators.required, Validators.min(0.000000000000000001)] }),
      fee: new FormControl(0, { validators: [Validators.max(10)] }),
      minParticipants: new FormControl(2, { validators: [Validators.required, Validators.min(2)] }),
      endDate: new FormControl(this.tomorrow, { validators: [Validators.required, Validators.min(this.tomorrow.getTime())] }),
    },)
  }

  onSubmit = async () => {
    console.log("create new tournament", this.tournamentForm.value.tournamentName)
    await this.createTournamentService.create(this.tournamentForm.value)
    this.routerService.navigate(['']);
  }
}
