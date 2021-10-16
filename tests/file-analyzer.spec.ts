import { fileAnalyzer } from '../src/file-analyzer';

const mockTags = ['tODo:', 'FIXME:', 'NOTE'];
const absolutePaths = ['./tests/mockFiles/mockFile0.js'];

describe('FileAnalyzer', () => {

  it('should returned all identified comments', async () => {
    const result = await fileAnalyzer(absolutePaths, mockTags);

    expect(result).toMatchSnapshot();
  });
});