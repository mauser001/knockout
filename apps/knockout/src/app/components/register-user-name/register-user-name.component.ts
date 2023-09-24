import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Web3ConnectService } from 'src/app/services/web3-connect.service';
import { RegisterUserService } from 'src/app/services/user/register-user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-register-user-name',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [RegisterUserService],
  templateUrl: './register-user-name.component.html',
  styleUrls: ['./register-user-name.component.scss']
})
export class RegisterUserNameComponent {
  isLoading$ = this.registerUserNameService.isLoading$;
  hasError$ = this.registerUserNameService.hasError$;
  userNameForm: FormGroup;
  isConnected$ = this.web3ConnectService.isConnected$;

  constructor(
    private registerUserNameService: RegisterUserService,
    private web3ConnectService: Web3ConnectService,
    private fb: FormBuilder,
    private routerService: Router
  ) {
    this.userNameForm = fb.group({
      name: new FormControl(""),
    },)
  }

  onSubmit = async () => {
    console.log("register user name", this.userNameForm.value.name)
    await this.registerUserNameService.register(this.userNameForm.value.name)
    this.routerService.navigate(['']);
  }

}
