import { Component, OnInit } from '@angular/core';
import { FlickrService } from './flickr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
