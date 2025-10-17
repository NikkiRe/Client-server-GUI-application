import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [CardModule, ButtonModule, InputTextModule, FormsModule, CommonModule]
})
export class AuthComponent {
  username: string = '';
  password: string = '';
  isLogin: boolean = true;
  errorMessage: string = '';

  private router = inject(Router);

  async authenticate() {
    try {
      const response = await axios.get(`http://localhost:8080/web_4th_lab-1.0/rest/authorization/${this.isLogin ? 'authorize' : 'register'}`, {
        params: {
          username: this.username,
          password: this.password,
        },
      });

      console.log('Server response:', response.data);

      if (response.data.startsWith('Authorized:')) {
        const authData = response.data.split(':')[1];
        const [userId, token] = authData.split('%');
        sessionStorage.setItem('id', userId);
        sessionStorage.setItem('token', token);
        this.router.navigate(['/main']);
      } else {
        this.errorMessage = this.isLogin ? 'Неверное имя пользователя или пароль' : 'Пользователь уже существует';
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      this.errorMessage = 'Ошибка авторизации';
    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }
}