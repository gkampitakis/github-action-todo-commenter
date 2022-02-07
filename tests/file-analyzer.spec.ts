import { fileAnalyzer } from '../src/file-analyzer';

describe('FileAnalyzer', () => {
  it('should return all identified comments', async () => {
    const result = await fileAnalyzer(
      [
        {
          filename: './tests/mockFiles/mockFile0.js',
          patch: `+// TODO: we should write tests
+function add() { } //FIXME::add implementation 
+function add() { } //FIXME::add implementation   
+ * tODo: this should present
+ * NOTE Please don't forget review
+// tODo: placeholder function`
        }
      ],
      ['tODo:', 'NOTE', 'FIXME:']
    );

    expect(result).toMatchSnapshot();
  });

  it('should skip comments not included on the pr', async () => {
    const result = await fileAnalyzer(
      [
        {
          filename: './tests/mockFiles/mockFile0.js',
          patch: `+// TODO: we should write tests
-function add() { } //FIXME::add implementation   
-function test() { } //tODo: this is an old comment
+ * tODo: this should present
+ * NOTE another note
+// tODo: placeholder function`
        }
      ],
      ['tODo:', 'NOTE', 'FIXME:']
    );

    expect(result).toMatchSnapshot();
  });

  it('should skip files with no matches', async () => {
    const result = await fileAnalyzer(
      [
        {
          filename: './tests/mockFiles/mockFile0.js',
          patch: `+// TODO: we should write tests`
        },
        { filename: './tests/mockFiles/mockFile1.js' }
      ],
      ['TODO:']
    );

    expect(result).toMatchSnapshot();
  });

  it('should return all comments if no patch provided', async () => {
    const result = await fileAnalyzer(
      [
        {
          filename: './tests/mockFiles/mockFile0.js'
        }
      ],
      ['tODo:', 'NOTE', 'FIXME:']
    );

    expect(result).toMatchSnapshot();
  });
});
