<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>redderblanket</title>
    <style>
        body { background: #8fceff; margin: 0; }
        figure { text-align: center; }
        img { width: 100%; border: 4px outset #eee; }
        figcaption { font-size: smaller; color: grey; }
        main { margin: auto; background: white; width: 40em; min-height: 100vh; padding: 1em; }
    </style>
</head>
<body>
    <main>
        <p>I'm a BBW/hyper artist. I want to make more sequences/short webcomics. Drawing makes me happy :)</p>
        <p>I don't like my art's availability being at the whim of some megasite, so I'm soft-launching the migration to MY site that has zero SEO!</p>

        <form action="index.php" style="text-align: center; background: #143b61; padding: 4px;">
            <input type="text" name="search">
            <input type="submit" value="Search">
        </form>
        <p style="font-size: smaller; color: grey; text-align: center;">10 results</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr;">
            <?php
                DISPLAY * FROM /art/ CONTAINING @search
                <figure>
                    <img src="[URL]">
                    <figcaption>[FILENAME]</figcaption>
                </figure>
            ?>
        </div>
    </main>
</body>
</html>