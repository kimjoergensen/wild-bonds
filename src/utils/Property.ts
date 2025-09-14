export const property = <T>(value?: T): Property<T> => {
  let internalValue = value;
  const listeners = new Set<(value: T | undefined) => void>();

  const get = (): T | undefined => {
    return internalValue;
  };

  function set(newValue: T) {
    internalValue = newValue;
    notify();
  }

  function update(updater: (currentValue: T | undefined) => T) {
    internalValue = updater(internalValue);
    notify();
  }

  function subscribe(listener: (value: T | undefined) => void): Subscription {
    listeners.add(listener);

    return {
      unsubscribe: () => {
        listeners.delete(listener);
      }
    };
  }

  function asReadonly(): ReadonlyProperty<T | undefined> {
    return Object.assign(get, { subscribe });
  }

  function notify() {
    for (const listener of listeners) {
      listener(internalValue);
    }
  }

  return Object.assign(get, { set, update, subscribe, asReadonly }) as Property<T>;
};

type Property<T> = (() => T) & {
  readonly set: (value: T) => void,
  readonly update: (updater: (currentValue: T) => T) => void,
  readonly subscribe: (listener: (value: T) => void) => Subscription,
  readonly asReadonly: () => ReadonlyProperty<T>,
};

export type ReadonlyProperty<T> = (() => T) & {
  readonly subscribe: (listener: (value: T) => void) => Subscription,
};

export type WritableProperty<T> = Property<T>;

export const isProperty = <T>(obj: any): obj is WritableProperty<T> => {
  return typeof obj === 'function' && 'set' in obj && 'update' in obj && 'subscribe' in obj;
}

export const isReadonlyProperty = <T>(obj: any): obj is ReadonlyProperty<T> => {
  return typeof obj === 'function' && 'subscribe' in obj && !('set' in obj) && !('update' in obj);
}

export type Subscription = { unsubscribe: () => void };

// Example usage:
// const health = property(100);
// health.subscribe((newHealth) => console.log('Health changed to', newHealth));
// health.set(80);
// health.update(h => h - 10);