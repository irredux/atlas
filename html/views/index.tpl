<!DOCTYPE html>
<html>
    <head>
        <link rel="shortcut icon" href="#" />
        <title>{{captions["title"]}}</title>
        <style>
        % include("css/colors")
        </style>
        <link rel="stylesheet" type="text/css" href="/file/css/main.css">
        <link rel="stylesheet" type="text/css" href="/file/css/print.css">
        <link rel="stylesheet" type="text/css" href="/file/css/mocha.css">
        <script src="/file/js/purify.min.js"></script>
        <script src="/file/js/mocha.js"></script>
        <script src="/file/js/chai.js"></script>
        <script type="module">
            import { Argos } from "/file/js/argos.js";
            import { Arachne } from "/file/js/arachne.js";
            import { Elements } from "/file/js/elements.js";
            globalThis.el = new Elements();
            globalThis.arachne = new Arachne("dmlw");
            globalThis.argos = new Argos();
        </script>
    </head>
    <body>
    </body>
</html>