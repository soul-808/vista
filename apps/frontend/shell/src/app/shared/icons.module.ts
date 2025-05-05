import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  User,
  FileText,
  Server,
  Lock,
  CheckCircle,
  ChevronRight,
  ArrowRight,
} from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      User,
      FileText,
      Server,
      Lock,
      CheckCircle,
      ChevronRight,
      ArrowRight,
    }),
  ],
  exports: [LucideAngularModule],
})
export class IconsModule {}
