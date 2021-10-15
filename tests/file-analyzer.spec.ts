import { fileAnalyzer } from '../src/file-analyzer';

const mockTags = ['tODo:', 'FIXME:', 'NOTE'];

describe('FileAnalyzer', () => {
  it('should returned all identified comments', async () => {
    const result = await fileAnalyzer(
      ['./tests/mockFiles/mockFile0.js'],
      mockTags
    );

    expect(result).toMatchSnapshot();
  });

  it('should skip files with no matches', async () => {
    const result = await fileAnalyzer(
      ['./tests/mockFiles/mockFile1.js'],
      mockTags
    );

    expect(result).toMatchSnapshot();
  });
});
