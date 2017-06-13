import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {

  constructor(private service: AppService) { }

  ngOnInit() {
    this.service.login('root', 'lost4god8').then((result) => {
      console.log(result);
      this.service.getExistingSearchs().then((results) => {
        console.log(results);
      });
    })
  }
}
