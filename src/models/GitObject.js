import { InternalError } from '../errors/InternalError.js'

export class GitObject {
  static wrap({ type, object }) {
    // This is a quick and dirty fix
    const objectWithoutCRLF = Buffer.from(object.toString("utf8")
      .replace(new RegExp("\x0D\x0A", 'g'), "\x0A"))

    return Buffer.concat([
      Buffer.from(`${type} ${objectWithoutCRLF.byteLength.toString()}\x00`),
      Buffer.from(objectWithoutCRLF),
    ])
  }

  static unwrap(buffer) {
    const s = buffer.indexOf(32) // first space
    const i = buffer.indexOf(0) // first null value
    const type = buffer.slice(0, s).toString('utf8') // get type of object
    const length = buffer.slice(s + 1, i).toString('utf8') // get type of object
    const actualLength = buffer.length - (i + 1)
    // verify length
    if (parseInt(length) !== actualLength) {
      throw new InternalError(
        `Length mismatch: expected ${length} bytes but got ${actualLength} instead.`
      )
    }
    return {
      type,
      object: Buffer.from(buffer.slice(i + 1)),
    }
  }
}
