import { Module } from '@nestjs/common';
import { DropboxAuthService } from './dropbox-auth.service';
import { DropboxService } from './dropbox.service';
import { DropboxController } from './dropbox.controller';
import { UploadsModule } from './upload.module'; // <--- IMPORTANTE

@Module({
  imports: [UploadsModule], // <--- AÑADIR
  controllers: [DropboxController],
  providers: [DropboxAuthService, DropboxService],
})
export class DropboxModule {}
