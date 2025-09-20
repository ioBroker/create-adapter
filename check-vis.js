const { createAdapter } = require('./build/src');

const visAnswers = {
    cli: true,
    target: 'directory',
    adapterName: 'template',
    description: 'Template for adapter development',
    authorName: 'Author',
    authorGithub: 'Author',
    authorEmail: 'author@mail.com',
    gitRemoteProtocol: 'HTTPS',
    dependabot: 'yes',
    license: 'MIT License',
    releaseScript: 'yes',
    gitCommit: 'no',
    defaultBranch: 'main',
    features: ['vis'],
    title: 'Template (VIS only)',
    type: 'visualization-widgets',
    widgetIsMainFunction: 'main',
};

(async () => {
    const files = await createAdapter(visAnswers, ['adapterName', 'title']);
    const jsFiles = Object.keys(files).filter(f => f.endsWith('.js') && !f.includes('test'));
    const tsFiles = Object.keys(files).filter(f => f.endsWith('.ts') && !f.includes('test'));
    console.log('VIS: JS files=' + jsFiles.length + ', TS files=' + tsFiles.length);
    if (jsFiles.length > 0) console.log('  JS:', jsFiles.slice(0, 3));
    if (tsFiles.length > 0) console.log('  TS:', tsFiles.slice(0, 3));
    
    const allFiles = Object.keys(files);
    const widgetFiles = allFiles.filter(f => f.includes('widget'));
    console.log('Widget-related files:', widgetFiles);
})();