import fs from "fs";

export class JsonCache<T> {
  private cache: Map<string, T>;

  constructor(private filePath: string) {
    this.cache = new Map();
    this.load();
  }

  private load() {
    if (fs.existsSync(this.filePath)) {
      const json = fs.readFileSync(this.filePath, "utf8");
      this.cache = new Map(Object.entries(JSON.parse(json)));
    }
  }

  private serialize() {
    return JSON.stringify(
      Array.from(this.cache.entries()).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {} as Record<string, T>
      )
    );
  }

  private save() {
    fs.writeFileSync(this.filePath, this.serialize());
  }

  public get(key: string): T | undefined {
    return this.cache.get(key);
  }

  public set(key: string, value: T): void {
    this.cache.set(key, value);
    this.save();
  }

  public delete(key: string): void {
    this.cache.delete(key);
    this.save();
  }
}
