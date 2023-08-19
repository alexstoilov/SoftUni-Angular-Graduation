import { Subscription } from 'rxjs';
import { Component, Input } from '@angular/core';
import { ApiCallsService } from 'src/app/core/services/api-calls.service';
import { ITopic } from 'src/app/shared/interfaces/itopic';

@Component({
  selector: 'app-subscribed-topics-card',
  templateUrl: './subscribed-topics-card.component.html',
  styleUrls: ['./subscribed-topics-card.component.css'],
})
export class SubscribedTopicsCardComponent {
  @Input() topicId!: string;
  topic: ITopic | undefined;

  constructor(private apiCalls: ApiCallsService) {}
  subscription: Subscription = new Subscription();

  ngOnInit() {
    this.subscription = this.apiCalls.getSingleTopic(this.topicId).subscribe({
      next: (response) => {
        this.topic = response.topic;
      },
      error: (err) => console.error(err),
      complete: () => {},
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}