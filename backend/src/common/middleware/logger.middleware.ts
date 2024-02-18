import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'GET' || req.method === 'DELETE') {
      Logger.log(
        `[${req.method}] ${req.baseUrl} / session.userId = ${
          req.session['userId']
        } / ${JSON.stringify(req.query)}`
      )
    } else if (req.method === 'POST' || req.method === 'PUT') {
      Logger.log(
        `[${req.method}] ${req.baseUrl} / session.userId = ${
          req.session['userId']
        } / ${JSON.stringify(req.body)}`
      )
    }

    const oldWrite = res.write
    const oldEnd = res.end

    const chunks: Buffer[] = []

    res.write = function (chunk) {
      chunks.push(Buffer.from(chunk))
      return oldWrite.apply(this, arguments as any)
    }

    res.end = function (chunk) {
      if (chunk) chunks.push(Buffer.from(chunk))

      const body = Buffer.concat(chunks).toString('utf8')

      Logger.log(`[RESPONSE] ${res.statusCode} / ${body}`)

      return oldEnd.apply(this, arguments as any)
    }

    next()
  }
}
