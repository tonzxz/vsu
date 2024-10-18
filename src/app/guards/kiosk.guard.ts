import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { QueueService } from '../services/queue.service';
import { KioskService } from '../services/kiosk.service';

export const kioskGuard: CanActivateFn = (route, state) => {
  
  const kioskService = inject(KioskService);
  const router = inject(Router);

  const kiosk = localStorage.getItem('kiosk');
  if(kiosk){
    kioskService.kiosk = JSON.parse(kiosk) as any;
  }
  if(route.url.toString() == 'selection'){
    if(kiosk){
      
      router.navigate(['/kiosk/forms'],{ queryParams: { department: kioskService.kiosk!.division } });

    }
  }
  
  if(route.url.toString() == 'forms'){
    if(!kiosk){
      router.navigate(['/kiosk/selection']);
    }
  }

  

  return true;
};
