import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces';
import { UUID } from 'src/utils/UUID';

export const GetCurrentUserUUID = createParamDecorator(
  (_: undefined, context: ExecutionContext): UUID => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return UUID.FromStr(user.uuid);
  },
);
