import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

/** NavbarComponent is responsible for rendering the navigation bar at the top of the application */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {


  /** Observable that determines if the back button should be shown based on the current URL */  
  showBackButton$: Observable<boolean> = this.router.events.pipe(
    map(() => {
      const url = this.router.url;
      return url.includes('/lists-of-questions');
    })
  );

  constructor(
    private router: Router,
  ) {}
   
  /** Clearing the local storage */
  clear(): void {
    localStorage.clear();
    window.location.reload();
  }
  
  /** Navigates user to the home page */
  goBack(): void {
    this.router.navigate(['/manage-questions']);
  }

}
