import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SWAGGER_CONFIG } from './swagger.config';
export class SwaggerApiDocs {
  private config: any;
  private app: any;

  constructor(app: INestApplication) {
    // take app instance
    this.app = app; // assign app instance to class memeber "app"
    this.config = new DocumentBuilder(); // initiate documentbuilder()
    this.config.setTitle(SWAGGER_CONFIG['title']); // assign the title of the API
    this.config.setDescription(SWAGGER_CONFIG['description']); // assign the title of the description
    this.config.setVersion(SWAGGER_CONFIG['version']); // assign the version of the API
  }

  newTag(tagName: string) {
    this.config.addTag(tagName); // create a new tag
  }

  buildDocument(): void {
    // create the document
    const documentFactory = () =>
      SwaggerModule.createDocument(this.app, this.config);
    SwaggerModule.setup('docs', this.app, documentFactory);
  }
}
