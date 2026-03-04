{ pkgs, lib, config, inputs, ... }:

{
  packages = [
    pkgs.git pkgs.hugo pkgs.dart-sass
    pkgs.wrangler
  ];

  languages.go.enable = true;
  languages.python.enable = true;
  languages.python.venv.enable = true;
  languages.python.venv.requirements = builtins.readFile ./requirements.txt;
  enterShell = ''
  '';
}
