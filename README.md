# Github Action Todo Commenter

Parses pull request files based on tags and creates a comment with a task list

## Usage

```yaml
name: Todo Comments
on: [pull_request]

jobs:
  todo-comments:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Create Todo Comments
        uses: gkampitakis/github-action-todo-commenter@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          ignore-pattern: '.js$|.snap$'
          review-message: "Please take a look :eyes:"
```

## Example

![Example](./docs/example.png)

## Note

This action uses the [octokit](https://octokit.github.io/rest.js/v18#pulls) for
diffs in a pr. 

```js
const { data: diff } = await octokit.rest.pulls.get({
  owner: "octokit",
  repo: "rest.js",
  pull_number: 123,
  mediaType: {
    format: "diff",
  },
});
```

In some cases the api doesn't return the `diff` so the action needs to run
`git diff`. So you need to set

```yaml
- name: Checkout
  uses: actions/checkout@v2
  with:
    fetch-depth: 0
```

If for some reason you can't set checkout action with this option, the 
`commenter` will still work with a `warning` and all the comments inside the file, 
matching the tags will be included.

---

> For releasing and versioning the github action 
https://github.com/actions/toolkit/blob/master/docs/action-versioning.md#recommendations.

**License MIT**
