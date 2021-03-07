run: clean
	bundle exec jekyll serve --incremental
build: clean
	bundle exec jekyll build --incremental
clean:
	rm -rf _site
