import { UpdateNoteRequest } from '../src/types/Note';

describe('Type Definitions', () => {
  it('should have proper UpdateNoteRequest interface', () => {
    const updateRequest: UpdateNoteRequest = {
      title: 'Updated Title',
      content: 'Updated Content'
    };

    expect(updateRequest.title).toBe('Updated Title');
    expect(updateRequest.content).toBe('Updated Content');
  });

  it('should allow partial UpdateNoteRequest', () => {
    const partialUpdate: UpdateNoteRequest = {
      title: 'Only Title'
    };

    expect(partialUpdate.title).toBe('Only Title');
    expect(partialUpdate.content).toBeUndefined();
  });

  it('should allow empty UpdateNoteRequest', () => {
    const emptyUpdate: UpdateNoteRequest = {};

    expect(emptyUpdate.title).toBeUndefined();
    expect(emptyUpdate.content).toBeUndefined();
  });
});
