# Updated ignore files

We've updated the `.gitignore` file to exclude some unwanted directories from being checked in to git. To do the same, add the following lines to your `.gitignore` file:

```
.*/
!.vscode/
!.github/
```

This excludes all directories starting with `"."`, except `.vscode` and `.github`. If you need to check in some other dot directories, add them to the file with a `!` in front of them.

---

Furthermore, we've added an `.eslintignore` file to avoid linter errors in files that should not be linted. If you use ESLint, add a `.eslintignore` file to your project root which contains

```
**/.eslintrc.js
```

Depending on the other features you use, add more lines:

-   If using React, add a line that contains `admin/build/`
-   If using TypeScript, add a line that contains `build/`
-   If using Prettier, add a line containing `.prettierrc.js`
