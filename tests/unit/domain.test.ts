import { describe, it, expect } from 'vitest';
import { BaseEntity } from '@domain/entities/BaseEntity';

class TestEntity extends BaseEntity {}

describe('BaseEntity', () => {
  it('should create an entity with a generated ID', () => {
    const entity = new TestEntity();
    expect(entity.id).toBeDefined();
    expect(typeof entity.id).toBe('string');
  });

  it('should create an entity with timestamps', () => {
    const entity = new TestEntity();
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
  });

  it('should accept custom ID and timestamps', () => {
    const customId = 'custom-123';
    const customDate = new Date('2024-01-01');
    const entity = new TestEntity(customId, customDate, customDate);

    expect(entity.id).toBe(customId);
    expect(entity.createdAt).toEqual(customDate);
    expect(entity.updatedAt).toEqual(customDate);
  });
});
