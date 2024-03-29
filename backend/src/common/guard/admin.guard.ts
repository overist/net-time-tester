import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    if (
      request.session.userId &&
      (request.session.role === 'ADMIN' ||
        request.session.role === 'SYSTEM_ADMIN')
    ) {
      return true
    } else {
      throw new UnauthorizedException()
    }
  }
}
