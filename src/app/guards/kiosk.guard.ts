import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { QueueService } from '../services/queue.service';

export const kioskGuard: CanActivateFn = (route, state) => {
  
  const queryService = inject(QueueService);
  const router = inject(Router);

  const kiosk = localStorage.getItem('kiosk');
  if(kiosk){
    queryService.kiosk = JSON.parse(kiosk) as any;
  }
  if(route.url.toString() == 'selection'){
    if(kiosk){
      
      router.navigate(['/kiosk/forms'],{ queryParams: { department: queryService.kiosk!.division } });

    }
  }
  
  if(route.url.toString() == 'forms'){
    if(!kiosk){
      router.navigate(['/kiosk/selection']);
    }
  }

  

  return true;
};
